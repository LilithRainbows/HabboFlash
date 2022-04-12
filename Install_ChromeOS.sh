#!/bin/bash

cd "$(cd "$(dirname "$0")" && pwd)" #Set current path to script path

ARCH=`dpkg --print-architecture`
if [ $ARCH = 'i386' ]; then
	ZIP='HabboFlash_Release3_Linux_x86';
elif [ $ARCH = 'amd64' ]; then
	ZIP='HabboFlash_Release3_Linux_x64';
elif [ $ARCH = 'arm32' ] || [ $ARCH = 'armhf' ]; then
	ZIP='HabboFlash_Release3_Linux_ARM32HF';
elif [ $ARCH = 'arm64' ]; then
	ZIP='HabboFlash_Release3_Linux_ARM64HF';
fi

sudo apt -y update
sudo apt install -y libnss3-dev

HabboFlashForLinuxAppPath=~/.local/share/applications/HabboFlashForLinux

wget https://github.com/LilithRainbows/HabboFlash/releases/download/release3_cu1/$ZIP.zip -O $HabboFlashForLinuxAppPath/$ZIP.zip

unzip -o $HabboFlashForLinuxAppPath/$ZIP.zip -d $HabboFlashForLinuxAppPath
mv -v $HabboFlashForLinuxAppPath/$ZIP/* $HabboFlashForLinuxAppPath
rm -r $HabboFlashForLinuxAppPath/$ZIP
chmod +x $HabboFlashForLinuxAppPath/HabboFlash

wget https://github.com/LilithRainbows/HabboFlash/raw/main/HabboFlashForLinux.png -O ~/.icons/HabboFlashForLinux.png
wget https://github.com/LilithRainbows/HabboFlash/raw/main/HabboFlashForLinux.desktop -O $HabboFlashForLinuxAppPath/../HabboFlashForLinux.desktop

rm $HabboFlashForLinuxAppPath/$ZIP.zip

# Installation script finished.
echo "Client installation finished. A shortcut for HabboLinux will appear on your Chromebook."

# Optional: remove this installation script.
rm $0

#Script base credits: https://github.com/belieb/
