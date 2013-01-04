#do something about 
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

#sorcery = chatserver(server='irc.sorcery.net',port=6667,pw ='',nick='odinbot',realname='odinbot',username='odinbot')
listofsockets = []	
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
		print self.server
		print self.port
		print self.socket
		self.socket.connect((self.server, self.port))
		print self.socket
		listofservers.append(self.socket)
		self.socket.sendall('nick ' + self.nick + "\r\n")
		self.socket.sendall('user ' + self.username + ' 0 * :' + self.realname  + "\r\n")
		# time.sleep(4)
		# self.socket.sendall('join #rotmg.bot\r\n')
		# self.sendmsg('hi')
		# chatbuffer = bytes()
		# while not self._end:
		# 	try:
		# 		chatbuffer += self.socket.recv(1024)
		# 	except socket.error, e:
		# 		try:  #get the errno
		# 			errno = e.errno
		# 		except AttributeError:
		# 			errno = e[0]
		# 		if errno == 11:
		# 			pass
		# 		else:
		# 			raise e
		# 	else:
		# 		data = chatbuffer.split(bytes("\n", "ascii"))
		# 		chatbuffer = data.pop()
		# 		for el in data:
		# 			print el
		# 			if el == 'ping':
		# 				self.socket.send('pong')
		# 	yield True

	def sendmsg(self,message):
		self.socket.sendall(message)

	def disconnect(self):
		listofsockets.remove(self.socket)
		self.socket.close()

class client:
	def __init__(self):
		loop = 1
		while loop == 1:
			rlist, wlist, xlist = select.select(listofsockets,[],[])
			if [rlist,wlist,xlist] == [[],[],[]]:
				print 'Iteration'
			else:
				for active in rlist:
					chatbuffer += active.recv(1024)
					data = chatbuffer.split(bytes("\n", "ascii"))
					for chatline in data:
						if chatline == 'ping':
							active.send('pong')
						else:
							print chatline
				#write something? 
					#still need to: 
					#1) Clean up connect function to fit with select(), 
					#2) Add to client class to make it do what connect() does 
					#3) Identify which socket it comes from 
					#4) SEnd data to each

if __name__ == '__main__':
	mainclient = client()
	sorcery = chatserver(server='irc.sorcery.net',port=6667,pw='',nick='OdinBot_',realname='odinbot',username='odinbot')
	while 1:
		mainclient.next()
