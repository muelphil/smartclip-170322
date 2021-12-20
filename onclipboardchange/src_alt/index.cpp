// #include <napi.h>
#include <string>
#include <set>
// #include <windows.h> // this is already included with napi-thread-safe-callback.hpp
#include <iostream>
#include <napi.h>
#include "napi-thread-safe-callback.hpp"
#include "test.hpp"

Napi::Boolean onClipboardChange(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	Napi::Function callback = info[0].As<Napi::Function>();
    auto callbackPtr = std::make_shared<ThreadSafeCallback>(info[0].As<Napi::Function>());
   	addListener(callbackPtr);
	return Napi::Boolean::New(env, true);
}

Napi::Boolean removeAllListeners(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	stopListening();
	return Napi::Boolean::New(env, true);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
	exports.Set(
		Napi::String::New(env, "onClipboardChange"),
		Napi::Function::New(env, onClipboardChange)
	);
	exports.Set(
		Napi::String::New(env, "removeAllListeners"),
		Napi::Function::New(env, removeAllListeners)
	);
	return exports;
}

NODE_API_MODULE(onclipboardchange, Init)