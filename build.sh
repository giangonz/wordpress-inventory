rm -rf build
rsync -av --progress . ./build --exclude build.sh --exclude build --exclude .git --exclude dist --exclude js/node_modules/ --exclude js/dist/
mv ./build/js ./build/jsbuild
cd ./build/jsbuild/
npm install
npm run build
cd ..
cd ./build/
mkdir -p js/dist
cp -R jsbuild/dist/* js/dist
rm -rf jsbuild
rm -rf ../dist
touch ../dist/.keep
mkdir -p ../dist
zip -r ../dist/ccsi_inventory.zip ./*
cd ..
rm -rf ./build
