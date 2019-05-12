
cat content.html | \
   sed '1,$s/!b/<span class="gt"> <\/span>/g' | \
   sed '1,$s/!B/<span class="gt">\&nbsp;<\/span>/g' | \
   sed '1,$s/!C/<span class="gt">\&clubs;<\/span>/g' | \
   sed '1,$s/!D/<span class="ot">\&diams;<\/span>/g' | \
   sed '1,$s/!H/<span class="rt">\&hearts;<\/span>/g' | \
   sed '1,$s/!S/<span class="bt">\&spades;<\/span>/g' > content2.html

cat head.html content2.html foot.html > final.html

# cygstart "final.html#system"

cygstart 'http://localhost:8080/final.html#bot'

# cygstart 'http://localhost:8080/final.html'

