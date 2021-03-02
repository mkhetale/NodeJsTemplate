# Get user
curl "http://127.0.0.1:6633/projectname/user"

# Delete user
curl -X DELETE "http://127.0.0.1:6633/projectname/user/ralstanvaz"

#Post user
curl -X POST -H "Content-Type: application/json" -d '
{
"firstName":"Ralstan",
"lastName":"vaz",
"mobileNo":"9920294797",
"emailId":"ralstan.vaz@gmail.com",
"userId":"ralstanvaz",
"password":"12345",
"type":"admin",
"images":"image"
  }' "http://127.0.0.1:6633/projectname/user"

# Login user
curl -X POST -H "Content-Type: application/json" -d '
{
"userId":"admin",
"password":"123456"
  }' "http://127.0.0.1:6633/projectname/user/login"

# update an user
curl -X PUT -H "Content-Type: application/json" -d '
{
"firstName":"Ralstan",
"lastName":"ssss",
"mobileNo":"8850219732",
"password":"123456"
  }' "http://127.0.0.1:6633/projectname/user/ralstanvaz"


# prune excludes the folder
find . -path './test' -prune -o -iname '*.js' -print

mkdir test
mkdir test2
mkdir test3
touch config.js
touch another.js
touch another2.js
touch test/test1.js
touch test2/test2.js
touch test3/showthis.js
# prune excludes the folder -o OR
find . -type d \( -path './test' -o -path './test2' \) -prune -o -iname '*' -type f \( ! -iname "config.js" ! -iname "another2.js" \) -print

\( ! -regex '.*/\..*' \)


find . -type d \( -path './src/node_modules' -o -path './.git' \) -prune -o -iname '*' -print

find . -type d \( -path './src/node_modules' \) -prune -o -iname '*' -type f -print -exec sed -i '' "s/let/const/g" {} +
# {} is an -exec paramater which get the current line of the output being processed
# + is to end
