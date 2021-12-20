// #include <napi.h>
#include <string>
#include <set>
#include <map>
// #include <windows.h> // this is already included with napi-thread-safe-callback.hpp
#include <iostream>
#include <napi.h>
#include "napi-thread-safe-callback.hpp"
#include "oncopy.hpp"
#include "onpaste.hpp"
#include "disableanimations.hpp"
#include "winuser.h"

std::map<std::string, uint32_t> clipboardFormatMap = {
	{ "CF_BITMAP", 2 },
	{ "CF_DIB", 8 },
	{ "CF_DIBV5", 17 },
	{ "CF_DIF", 5 },
	{ "CF_DSPBITMAP", 0x0082 },
	{ "CF_DSPENHMETAFILE", 0x008E },
	{ "CF_DSPMETAFILEPICT", 0x0083 },
	{ "CF_DSPTEXT", 0x0081 },
	{ "CF_ENHMETAFILE", 14 },
	{ "CF_GDIOBJFIRST", 0x0300 },
	{ "CF_GDIOBJLAST", 0x03FF },
	{ "CF_HDROP", 15 },
	{ "CF_LOCALE", 16 },
	{ "CF_METAFILEPICT", 3 },
	{ "CF_OEMTEXT", 7 },
	{ "CF_OWNERDISPLAY", 0x0080 },
	{ "CF_PALETTE", 9 },
	{ "CF_PENDATA", 10 },
	{ "CF_PRIVATEFIRST", 0x0200 },
	{ "CF_PRIVATELAST", 0x02FF },
	{ "CF_RIFF", 11 },
	{ "CF_SYLK", 4 },
	{ "CF_TEXT", 1 },
	{ "CF_TIFF", 6 },
	{ "CF_UNICODETEXT", 13 },
	{ "CF_WAVE", 12 }
};

Napi::Boolean napiWriteBuffers(const Napi::CallbackInfo& info){
	Napi::Env env = info.Env();
	Napi::Value val = info[0];
	if(!val.IsObject()){
		return Napi::Boolean::New(env, false);
	}
	Napi::Object buffers = val.As<Napi::Object>();
	try{
		OpenClipboard(0);
		EmptyClipboard();
		Napi::Array properties = buffers.GetPropertyNames();
			for(uint32_t index = 0; index < properties.Length(); index++){
				Napi::Value property = properties[index];
				uint32_t propertyAsNumber = -1;
				std::string propertyString = property.As<Napi::String>().Utf8Value();
				try{
					std::cout << "IsNumber, not found" << std::endl;
					propertyAsNumber = std::stoi(propertyString);
				} catch ( ... ){
					if(clipboardFormatMap.count(propertyString) != 0){
						std::cout << "IsString, not found" << std::endl;
						propertyAsNumber = clipboardFormatMap[propertyString];
					} else {
						std::cout << "IsString, found" << std::endl;
						propertyAsNumber = RegisterClipboardFormatA(const_cast<char *>(propertyString.c_str()));
						clipboardFormatMap[propertyString] = propertyAsNumber;
					}
				}
				
				Napi::Value bufferValue = buffers.Get(property);
				Napi::Buffer<char> buffer = bufferValue.As<Napi::Buffer<char>>();
				auto bufferData = buffer.Data();
				SIZE_T size = buffer.Length();
				UINT flags = GMEM_MOVEABLE;
				HGLOBAL handle = GlobalAlloc(flags, size);
				LPVOID data_ptr = GlobalLock(handle);
				memmove(data_ptr, bufferData, size);
				SetClipboardData(propertyAsNumber, handle);
				GlobalUnlock(handle);
			}
			CloseClipboard();
			return Napi::Boolean::New(env, true);
	} catch(const std::exception& e) {
		Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
		return Napi::Boolean::New(env, false);
	}
}

Napi::Boolean disableAnimations(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	Napi::Value val = info[0];
	if(val.IsBuffer()){
		Napi::Buffer<void*> buf = val.As<Napi::Buffer<void*>>();
		HWND win = static_cast<HWND>(*reinterpret_cast<void **>(buf.Data()));
	   	const bool result = DisableDwmAnimations(win);
		return Napi::Boolean::New(env, result);
	}
	return Napi::Boolean::New(env, false);
}

Napi::Boolean napiStartListeningForPasteAndEscape(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
    std::shared_ptr<ThreadSafeCallback> pasteCallbackPtr = NULL; 
	std::shared_ptr<ThreadSafeCallback> escCallbackPtr = NULL;
	try{ // pasteCallback may be null
		Napi::Function pasteCallback = info[0].As<Napi::Function>();
    	pasteCallbackPtr = std::make_shared<ThreadSafeCallback>(pasteCallback);
    } catch(...){}
	try{ // escListener may be null
		Napi::Function escCallback = info[1].As<Napi::Function>();
    	escCallbackPtr = std::make_shared<ThreadSafeCallback>(escCallback);
    } catch(...){}
   	const bool result = startListeningForPasteAndEscape(pasteCallbackPtr, escCallbackPtr);
	return Napi::Boolean::New(env, result);
}

Napi::Boolean napiStopListeningForPasteAndEscape(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	const bool result = stopListeningForPasteAndEscape();
	return Napi::Boolean::New(env, result);
}

Napi::Boolean napiStartListeningForCopy(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	Napi::Function callback = info[0].As<Napi::Function>();
    auto callbackPtr = std::make_shared<ThreadSafeCallback>(info[0].As<Napi::Function>());
   	const bool result = startListeningForCopy(callbackPtr);
	return Napi::Boolean::New(env, result);
}

Napi::Boolean napiStopListeningForCopy(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	const bool result = stopListeningForCopy();
	return Napi::Boolean::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
	exports.Set(
		Napi::String::New(env, "startListeningForCopy"),
		Napi::Function::New(env, napiStartListeningForCopy)
	);
	exports.Set(
		Napi::String::New(env, "stopListeningForCopy"),
		Napi::Function::New(env, napiStopListeningForCopy)
	);
	exports.Set(
		Napi::String::New(env, "startListeningForPasteAndEscape"),
		Napi::Function::New(env, napiStartListeningForPasteAndEscape)
	);
	exports.Set(
		Napi::String::New(env, "stopListeningForPasteAndEscape"),
		Napi::Function::New(env, napiStopListeningForPasteAndEscape)
	);
	exports.Set(
		Napi::String::New(env, "disableAnimations"),
		Napi::Function::New(env, disableAnimations)
	);
	exports.Set(
		Napi::String::New(env, "writeBuffers"),
		Napi::Function::New(env, napiWriteBuffers)
	);
	return exports;
}

NODE_API_MODULE(onclipboardchange, Init)