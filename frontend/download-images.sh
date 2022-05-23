echo """

IMAGES ARE NOT FOR REDISTRIBUTION
!!! DON'T RIGHT-CLICK THESE IMAGES PLEASE !!!

"""

export STATIC_URL=https://dhstatic.hum.uu.nl/
cd src/assets/img
rm *
curl "$STATIC_URL/2022_04_22 Yale FAS Fatima El-Tayeb_Lavitt_1874_R.jpg" -O
curl "$STATIC_URL/472px-Etienne_Balibar_in_Berkeley_-2014.jpeg" -O
curl "$STATIC_URL/600px-Sara_Ahmed-IMG_6457.jpeg" -O
curl "$STATIC_URL/Assia_Djebar.jpeg" -O
curl "$STATIC_URL/Edward_Said_and_Daniel_Barenboim_in_Sevilla,_2002_(Said).jpeg" -O
curl "$STATIC_URL/Fanon.jpeg" -O
curl "$STATIC_URL/Fotos Jean van Lingen.jpg" -O
curl "$STATIC_URL/Gramsci.png" -O
curl "$STATIC_URL/Recents_-_1_of_1.jpeg" -O
curl "$STATIC_URL/Stuart Hall by Dharmachari Mahasiddhi.jpg" -O
curl "$STATIC_URL/Zigmunt_Bauman_na_20_Forumi_vydavciv(Cropped).jpeg" -O
curl "$STATIC_URL/portrait-Paul-Gilroy1-1536x974.png" -O
