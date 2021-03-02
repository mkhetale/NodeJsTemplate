#!/bin/bash

# if [ $# -lt 1 ]; then
#     echo ${0} from to
#     exit 0
# fi

while read line
do
FROM="let $line"
TO="const $line"
echo $FROM "to" echo $TO
find . -type d \( -path './src/node_modules' \) -prune -o \( ! -regex '.*/\..*' \) -type f \( ! -iname "setproj" \) -exec sed -i '' "s/$FROM/$TO/g" {} +
done



