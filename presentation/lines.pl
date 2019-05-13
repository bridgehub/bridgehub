use strict;
use warnings;

my $text;
my $char;

while ($text = <>) {
  chomp($text);
  if(''  eq $text){ print "<br />\n";       next; }
  if(' ' eq $text){ print "<br /><br />\n"; next; }
  my $i=0;
  my $mono=0;
  foreach $char (split('', $text)) {
    if($i == 0 && $char eq ' '){
      $mono=1;
      print '<span class="mono">'
    }
    if($mono && ' ' eq $char) 
    { print '&nbsp;'; }
    else 
    { print $char;    }
    $i++;
  }
  if($mono){print '</span><br />'; }
  print "\n";
}
