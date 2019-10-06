#include <napi.h>
#include "pimiibo-emitter.h"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  PimiiboEmitter::Init(env, exports);
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
