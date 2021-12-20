#include <napi.h>
#include <string>
#include "onclipboardchange.h"

// native C++ function that is assigned to 'onclipboardchange' Ãproperty on 'exports' object
Napi::String onClipboardChange(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	// call 'onClipboardChange' function from 'onclipboardchange.cpp' file
	Napi::Function callback = info[0].As<Napi::Function>();
	Napi::Value value = callback.Call(env.Global(), {});
	std::string str = (std::string) value.ToString();
	str = "echo" + str;
	return Napi::String::New(env, str);
	// std::string result = helloUser(user);
	// std::string str = "failed";
	// return Napi::String::New(env, failed);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
	exports.Set(
		Napi::String::New(env, "onClipboardChange"),
		Napi::Function::New(env, onClipboardChange)
	);
	return exports;
}

NODE_API_MODULE(onclipboardchange, Init)
