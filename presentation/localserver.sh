#!/bin/bash

cd ./static

echo 'URL: http://localhost:8080/systrainer.html'

cygstart "http://localhost:8080/systrainer.html"

http-server .

