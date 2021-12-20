// #include "winuser.h"
// #include "napi.h"

// class Clipboard {

// 	Clipbaord(){
// 		OpenClipboard(0)
// 	}

// 	~Clipboard(){
// 		CloseClipboard()
// 	}

// }

// bool writeBuffers(Napi::Object buffers){
// 	Clipboard clipboard = new Clipboard();
// 	EmptyClipboard();
// 	Napi::Array properties = buffers.GetPropertyNames();

// 	for(int i = 0; i < properties.Length(); i++){
// 		uint property = properties[i].As<Napi::Number>().Uint32Value();
// 		Napi::Buffer<char> buffer = buffers.Get(property).As<Napi::Buffer<char>();
// 		// flags = GMEM_MOVEABLE;
// 		// int size = sizeof(buffer);
// 		SetClipboardData(property, buffer.Data());
// 	}

// 	// content = CreateStringBuffer(data)
// 	// flags = GMEM_MOVEABLE
// 	// size = ctypes.sizeof(content)
// 	// handle = GlobalAlloc(flags, size)
// 	// data_ptr = GlobalLock(handle)
// 	// ctypes.memmove(data_ptr, content, size)
// 	// SetClipboardData(type, handle)
// 	// GlobalUnlock(handle)
// }

