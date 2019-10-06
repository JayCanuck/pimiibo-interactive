#include "amiibo.h"
#include "amiitool.h"
#include "nfchandler.h"
#include "pimiibo-emitter.h"

#include <stdio.h>

Napi::FunctionReference PimiiboEmitter::constructor;

Napi::Object PimiiboEmitter::Init(Napi::Env env, Napi::Object exports) {
  Napi::HandleScope scope(env);

  Napi::Function func =
      DefineClass(env,
                  "PimiiboEmitter",
                  {InstanceMethod("callAndEmit", &PimiiboEmitter::CallAndEmit)});

  constructor = Napi::Persistent(func);
  constructor.SuppressDestruct();

  exports.Set("PimiiboEmitter", func);
  return exports;
}

PimiiboEmitter::PimiiboEmitter(const Napi::CallbackInfo& info) : Napi::ObjectWrap<PimiiboEmitter>(info) {
  Napi::Env env = info.Env();
  Napi::String key = info[0].As<Napi::String>();
  Napi::String amiibo = info[1].As<Napi::String>();
  this->_key = key.Utf8Value();
  this->_amiibo = amiibo.Utf8Value();
}

Napi::Value PimiiboEmitter::CallAndEmit(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi:Value fnThis = info.This();
  Napi::Function emit = fnThis.As<Napi::Object>().Get("emit").As<Napi::Function>();

  Amiitool::setKeyPath(this->_key.c_str());
  Amiibo *amiibo = new Amiibo(this->_amiibo.c_str());

  try {
    NFCHandler *nfc = new NFCHandler(env, fnThis, emit);
    nfc->writeAmiibo(amiibo);
  } catch (const char* msg) {
    emit.Call(
        fnThis,
        {Napi::String::New(env, "error"), Napi::String::New(env, msg)});
  }
  return Napi::String::New(env, "OK");
}
