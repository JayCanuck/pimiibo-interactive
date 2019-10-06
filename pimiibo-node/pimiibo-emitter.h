#include <napi.h>

class PimiiboEmitter : public Napi::ObjectWrap<PimiiboEmitter> {
 public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  PimiiboEmitter(const Napi::CallbackInfo& info);

 private:
  static Napi::FunctionReference constructor;
  std::string _key;
  std::string _amiibo;
  Napi::Value CallAndEmit(const Napi::CallbackInfo& info);
};
