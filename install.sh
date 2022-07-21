#!/bin/bash

# Colours
RED="\e[1;31m"
GREEN="\e[1;32m"
YELLOW="\e[1;33m"
BLUE="\e[1;34m"
PURPLE="\e[1;35m"
CYAN="\e[1;36m"
RESET_COLOUR="\e[0m"

ARCH="$(uname -m)"
DEBIAN_ARCH=`dpkg --print-architecture` # Kept it because there are a lot of architectures listed with 'uname -m'
if [ $ARCH == 'x86' ] || [ $DEBIAN_ARCH == 'i386' ]; then
	ZIP='HabboFlash_Release3_Linux_x86';
elif [ $ARCH == 'x86_64' ] || [ $DEBIAN_ARCH == 'amd64' ]; then
	ZIP='HabboFlash_Release3_Linux_x64';
elif [ $ARCH == 'armv7l' ] || [ $DEBIAN_ARCH == 'arm32' ] || [ $DEBIAN_ARCH == 'armhf' ]; then
	ZIP='HabboFlash_Release3_Linux_ARM32';
elif [ $DEBIAN_ARCH == 'arm64' ]; then
	printf "$BLUE""[Adding Armhf architecture]""$RESET_COLOUR""\n"
	sudo dpkg --add-architecture armhf
	sudo apt-get update
	sudo apt-get install libc6:armhf libstdc++6:armhf
	cd /lib
	sudo ln -s arm-linux-gnueabihf/ld-2.23.so ld-linux.so.3
	ZIP='HabboFlash_Release3_Linux_ARM32';
fi

cd "$(cd "$(dirname "$0")" && pwd)" #Set current path to script path

printf "$BLUE""[Checking dependencies]""$RESET_COLOUR""\n"
if type dpkg &>/dev/null; then
    packages="tar unzip wget libnss3 $packages"
else
    packages="tar unzip wget nss $packages"
fi
printf "\n"

for package in $packages; do
    if type dpkg &>/dev/null; then
        if [ -z "$(dpkg --list | grep "$package")" ]; then
            if ! sudo apt install $package -y 2&>/dev/null; then
                printf "$RED""ERROR: ""$PURPLE""$package""$RED"" failed to install! Closing...""$RESET_COLOUR""\n"
                exit 1
            else
                printf "$GREEN""$PURPLE""$package""$GREEN"" has been installed!""$RESET_COLOUR""\n"
            fi
        else
            printf "$PURPLE""$package""$RESET_COLOUR"" has already been satisfied!\n"
        fi
    else
        if [ -z "$(pacman -Q | grep "$package")" ]; then
            if ! sudo pacman -S --needed --noconfirm $package 2&>/dev/null; then
                printf "$RED""ERROR: ""$PURPLE""$package""$RED"" failed to install! Closing...""$RESET_COLOUR""\n"
                exit 1
            else
                printf "$GREEN""$PURPLE""$package""$GREEN"" has been installed!""$RESET_COLOUR""\n"
            fi
        else
            printf "$PURPLE""$package""$RESET_COLOUR"" has already been satisfied!\n"
        fi
    fi
done
printf "\n"

HabboFlashForLinuxAppPath=$HOME/.local/share/applications/HabboFlashForLinux
#rm -r $HabboFlashForLinuxAppPath
mkdir -vp $HabboFlashForLinuxAppPath
mkdir -vp $HOME/.icons
wget -O HabboFlash.tar.gz https://github.com/LilithRainbows/HabboFlash/tarball/master
tar -xvf HabboFlash.tar.gz
mv -v *-HabboFlash-* HabboFlash
chown -vR $USER:$USER HabboFlash # Use sudo if this don't work?
printf "$BLUE""[Downloading client]""$RESET_COLOUR""\n"
wget -O HabboFlash/$ZIP.zip https://github.com/LilithRainbows/HabboFlash/releases/download/releas3_u2/$ZIP.zip
printf "$BLUE""[Extracting client]""$RESET_COLOUR""\n"
unzip -o HabboFlash/$ZIP.zip
mv -v $ZIP/* $HabboFlashForLinuxAppPath
mv -v HabboFlash/HabboFlash/* $HabboFlashForLinuxAppPath/resources/app
mv -v HabboFlash/HabboFlashForLinux.png $HOME/.icons
mv -v HabboFlash/HabboFlashForLinux.desktop $HabboFlashForLinuxAppPath/..
chmod -v +x $HabboFlashForLinuxAppPath/HabboFlash
rm -vr HabboFlash
rm -vr HabboFlash.tar.gz

printf "$GREEN""Client installation finished. A shortcut for HabboFlashForLinux will appear on your system.""$RESET_COLOUR""\n"

# Script base credits:
# https://github.com/belieb/
# https://github.com/KanuX-14/
