#include <iostream>
#include <thread>

int i;
std::thread paste_thread;

int main(){
	std::cout << "Hello World" << "paste_thread=["<< paste_thread <<"]"<< std::endl;
}