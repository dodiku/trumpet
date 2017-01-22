<CsoundSynthesizer>
<CsOptions>
-i adc2
-+rtaudio="CoreAudio"
--realtime
; -iadc3, -iadc:hw:0
; -iadc:hw:0,
; -iadc3, -iadc:hw:0
</CsOptions>
<CsInstruments>
sr     = 44100
kr     = 4410
ksmps  = 10
nchnls = 2
0dbfs = 1.0





gaping = 0

gaguitar = 0


instr 101

; iduration = 2
iamplitude = 0.5
iattack = 0.001
iduration = p3


aenv linseg 0, iduration * iattack, iamplitude, iduration * ( 1 - iattack ), 0
ares poscil3 aenv, 440, 1
ares moogvcf ares, 2000, 0.2
; outs ares, ares
gaping = ares

endin


instr 102

; iduration = 2
iamplitude = p4
iattack = 0.001
iduration = p3
ifreq = p5


; aenv linseg 0, iduration * iattack, iamplitude, iduration * ( 1 - iattack ), 0
ares poscil3 iamplitude, ifreq, 1
; ares moogvcf ares, 2000, 0.2
outs ares, ares

endin


instr	99	;guitar input

ainL, ainR	ins	

ain = (ainL + ainR)*0.5

ktresh rms ain

;checking the volume
if(ktresh > 0.01 && ktresh < 0.0101) then
	aenv adsr 0.1, 4, 10, 10
	; gaguitar = aafterenv

	ifftsize = 1024*16
	iwtype = 1    /* cleaner with hanning window */
	fsig pvsanal   ain, ifftsize, ifftsize/4, ifftsize, iwtype
	kfreq, kamp pvspitch   fsig, 0.01
	printk 0, kfreq*4
	printk 0, kamp*10
	event "i", 102, 0, 5, kamp*5, kfreq*4


endif
endin

instr 5

endin

instr 100 ;mixer



aping = gaping
; aguitar = gaguitar
out aping;, gaguitar
; gaping = 0

endin


</CsInstruments>
<CsScore>

f1 0 [2^16] 10 1 1 0.05 0 ; Sine
f2 0 [2^16] 10 1 0.15 6 2 1 ; default background sound
f3 0 [2^14] 10 1 0   0.3 0    0.2 0     0.14 0     .111
f4 0 [2^14] 10 1 1   1   1    0.7 0.5   0.3  0.1

i 100	0	30000 ; mixer
i 99	0	30000 ; guitar channel
i 101	0	0.5
i 101	+	0.5
i 101	+	0.5
i 101	+	0.5




</CsScore>
</CsoundSynthesizer>
<bsbPanel>
 <label>Widgets</label>
 <objectName/>
 <x>100</x>
 <y>100</y>
 <width>320</width>
 <height>240</height>
 <visible>true</visible>
 <uuid/>
 <bgcolor mode="nobackground">
  <r>255</r>
  <g>255</g>
  <b>255</b>
 </bgcolor>
</bsbPanel>
<bsbPresets>
</bsbPresets>
