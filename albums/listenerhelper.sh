#!/bin/bash

	FIRST_RUN=true

while true; do
	# Waiting for an event from mpd; play/pause/next/previous
	# this is lets kunst use less CPU :)
	while true; do
		mpc idle player &>/dev/null && (mpc status | grep "\[playing\]" &>/dev/null) && break
	done
	echo "MPD reported an event" | ncat -U electron_mpc.sock

done