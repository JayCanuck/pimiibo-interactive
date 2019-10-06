#include "nfchandler.h"
#include "amiitool.h"
#include "amiibo.h"

#include <stdio.h>
#include <stdlib.h>
#include <nfc/nfc.h>
#include <napi.h>

#define PAGE_COUNT 135
#define WRITE_COMMAND 0XA2

const uint8_t dynamicLockBytes[4] = { 0x01, 0x00, 0x0f, 0xbd };
const uint8_t staticLockBytes[4] = { 0x00, 0x00, 0x0F, 0xE0 };

const nfc_modulation nmMifare = {
  .nmt = NMT_ISO14443A,
  .nbr = NBR_106,
};

NFCHandler::NFCHandler(Napi::Env env, Napi::Value fnThis, Napi::Function emit) {
  this->env = env;
  this->fnThis = fnThis;
  this->emit = emit;

  emitEvent("init");
  nfc_init(&context);

  if (!context) {
    throw "Unable to init libnfc.";
  }

  device = nfc_open(context, NULL);

  if (device == NULL) {
    throw "Unable to open NFC device.";
  }

  if (nfc_initiator_init(device) < 0) {
    nfc_perror(device, "nfc_initiator_init");
    throw "Device failed to load with libnfc";
  }

  emitEvent("open");
}

void NFCHandler::emitEvent(char *event) {
  this->emit.Call(this->fnThis, {Napi::String::New(env, event)});
}

void NFCHandler::emitPageWrite(int page) {
  Napi::Object payload = new Napi::Object::New(this->env);
  payload.Set("page", Napi::Number::New(env, page));
  payload.Set("count", Napi::Number::New(env, PAGE_COUNT));
  this->emit.Call(
        this->fnThis,
        {Napi::String::New(env, "page"), payload});
}

void NFCHandler::readTagUUID(uint8_t uuidBuffer[]) {
  emitEvent("scan");

  if (nfc_initiator_select_passive_target(device, nmMifare, NULL, 0, &target) > 0) {
    printf("Read UID: ");
    int uidSize = target.nti.nai.szUidLen;
    Amiitool::shared()->printHex(target.nti.nai.abtUid, uidSize);

    if (UUID_SIZE != uidSize) {
      throw "Incorrect sized UID in file.";
    }

    for (int i = 0; i < UUID_SIZE; i++) {
      uuidBuffer[i] = target.nti.nai.abtUid[i];
    }
  }
}

void NFCHandler::writeAmiibo(Amiibo *amiibo) {
    uint8_t uuid[UUID_SIZE];
    readTagUUID(uuid);

    amiibo->setUUID(uuid);
    writeBuffer(amiibo->encryptedBuffer);
}

void NFCHandler::writeBuffer(const uint8_t *buffer) {
  emitEvent("write");
  writeDataPages(buffer);
  writeDynamicLockBytes();
  writeStaticLockBytes();
  emitEvent("end");
}

void NFCHandler::writeDataPages(const uint8_t *buffer) {
  for (uint8_t i = 3; i < PAGE_COUNT; i++) {
    writePage(i, buffer + (i * 4));
  }
  emitEvent("data-pages");
}

void NFCHandler::writeDynamicLockBytes() {
  writePage(130, dynamicLockBytes);
  emitEvent("dynamic-lock");
}

void NFCHandler::writeStaticLockBytes() {
  writePage(2, staticLockBytes);
  emitEvent("static-lock");
}

void NFCHandler::writePage(uint8_t page, const uint8_t *buffer) {
  emitPageWrite(int(page));
  uint8_t sendData[6] = {
    WRITE_COMMAND, page, buffer[0], buffer[1], buffer[2], buffer[3]
  };

  int responseCode = nfc_initiator_transceive_bytes(device, sendData, 6, NULL, 0, 0);

  if (responseCode == 0) {
    emitEvent("page-end");
  } else {
    nfc_perror(device, "Write");
    throw "Page write failed.";
  }
}
