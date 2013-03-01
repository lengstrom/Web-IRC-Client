#write something? 
	#still need to: 
	#1) Clean up connect function to fit with select(), 
	#2) Add to client class to make it do what connect() does 
	#3) Identify which socket it comes from 
	#4) SEnd data to each

import time
import sys
import socket
import sys
import re
import string
import time
import threading
import os
import traceback
import select

#sorcery = chatserver(server='irc.sorcery.net',port=6667,pw ='',nick='mptpdoma',realname='mptpdoma',username='mptpdoma')
listofsockets = []
servernames = []
class bytes(object):
	def __new__(self, b='', encoding='utf8'):
		return str(b)

class chatserver:
	def __init__(self,server,port,nick,pw,username,realname):
		self.server = server
		self.port=port
		self.nick = nick
		if pw != '':
			self.pw = pw
		else:
			self.pw = ''
		self.username = username
		self.realname = realname
		self.socket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
		self._end = 0
		self.socket.connect((self.server, self.port))
		listofsockets.append(self.socket)
		servernames.append([self.socket.getpeername(),self.server))
		self.socket.sendall('nick ' + self.nick + "\r\n")
		time.sleep(.3)
		self.socket.sendall('user ' + self.username + ' 0 * :' + self.realname  + "\r\n")
		time.sleep(.3)
		self.socket.sendall('JOIN #rotmg.bot' + "\r\n")
		time.sleep(.3)
		self.socket.sendall('PRIVMSG #rotmg.bot: o' + "\r\n")

	def sendmsg(self,message):
		self.socket.sendall(message)

	def disconnect(self):
		listofsockets.remove(self.socket)
		self.socket.close()

class client:
	def __init__(self):
		chatbuffer = ''
		while 1:
			rlist, wlist, xlist = select.select(listofsockets,[],[],1)
			print listofsockets
			if [rlist,wlist,xlist] != [[],[],[]]:
				for active in rlist:
					ircserver = ''
					for ip in servernames:
						if ip[0] == active.getpeername()
							ircserver = ip[1]
					chatbuffer += active.recv(1024)
					data = chatbuffer.split(bytes("\n", "ascii"))
					for chatline in data:
						if chatline == 'ping':
							active.send('pong')
						else:
							print ircsrever + chatline

def clientmessage(self,themessage,servername):
	self.messageserver = ''
	for ip in servernames:
		if ip[1] == servername
			ip[2].sendmsg()
#asdfasdf			

if __name__ == '__main__':
	sorcery = chatserver(server='irc.sorcery.net',port=6667,pw='',nick='mptpdoma',realname='mptpdoma',username='mptpdoma')

if __name__ == '__main__':
	mainclient = client()
	while 1:
		mainclient.next() #Do something about this functionality, unsure of what to do for it