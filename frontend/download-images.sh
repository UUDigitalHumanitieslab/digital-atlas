echo """

IMAGES ARE NOT FOR REDISTRIBUTION
!!! DON'T RIGHT-CLICK THESE IMAGES PLEASE !!!

"""

export STATIC_URL=https://dhstatic.hum.uu.nl/digital-atlas
mkdir -p src/assets/img
cd src/assets/img
rm *
curl --fail "$STATIC_URL/images.zip" -O
unzip images.zip
