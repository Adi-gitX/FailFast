#!/bin/bash
echo "--- DIAGNOSTIC START ---" > diagnostic.txt
date >> diagnostic.txt
git status >> diagnostic.txt 2>&1
echo "--- DIAGNOSTIC END ---" >> diagnostic.txt
