# Albums
## Screenshots
# Main album grid
![albumgrid](https://github.com/MaxBayly/albums/blob/master/screenshots/albumsagain.png)
# Album view 
![albumView](https://github.com/MaxBayly/albums/blob/master/screenshots/italicsexample.png)
## Currently extremely experimental (slow, incomplete)
Currently building towards feature-complete before focussing on optimisation.

Music root directory is currently hard-coded, will not run on other systems.

## Dev notes
To determine which song to italicise/bold:
- Check if currently displayed album is the playing album
- If it is, 
	- get track number from MPD
	- get `song` with id corresponding to track number
	- set class to include `playing` (`element.setAttribute('class', "song playing")`)

Upon song change:
- Check if currently displayed album is the playing album
- If it is, 
	- Store previous song in `prevSong`
	- Find `song` with id corresponding to `prevSong` 
	- Set class to remove `playing` (`element.setAttribute('class', "song")`)

