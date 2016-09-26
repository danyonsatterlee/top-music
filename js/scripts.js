$(function() {

  let $artists = $('#artists');

  $('#search').click(displayTopArtists);
  $('#country').keypress(event => {
    if (event.key==='Enter') displayTopArtists();
  });

  function displayTopArtists(){
    $artists.empty();

    let country = $('#country').val();

    let url =
    `http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=${country}&api_key=40335b205d4c972b3d13801204a24423&format=json`;

    $.getJSON(url, data=> {

      console.log(data);

      let country = data.topartists['@attr'].country;
      let artists = data.topartists.artist.slice(0,10);

      artists.forEach((artist,i) =>{

        let artistName= artist.name;
        let imgURL= artist.image[3]['#text'];
        $artists.append(`
          <div class="col-md-6 text-center">
          <h2>${i+1}. ${artistName}</h2>
          <img src=${imgURL} alt=${artistName} class="img-responsive center-block"/>
          <p>
          <a onclick="getTopTracks('${artistName}')">
          Get Top Tracks
          </a>
          </p>
          </div>
        `);

      }); // end artists.forEach

    }); // end getJSON

  } // end displayTopArtists

}); // end doc ready

  //fail function not working fix .fail(function){
  //   $artists.text('Sorry ${country.val()} name not found.')
  // };


  function getTopTracks(artist){

    let url=`https://api.spotify.com/v1/search?q=${artist}&type=artist&limit=1`

    $.getJSON(url, data => {
      let artistID = data.artists.items[0].id;
      let artistImgUrl = data.artists.items[0].images[0].url;
      $.getJSON(`https://api.spotify.com/v1/artists/${artistID}/top-tracks?country=US`, data =>{


        let tracks = data.tracks;
let tracksDiv= '';



tracks.forEach((track, i) => {
  let trackName = track.name;
  let album = track.album.name;
  let audioUrl = track.preview_url;
  let albumImgUrl = track.album.images[0].url;
  let popularity = track.popularity;

  tracksDiv += `
  <div class=" col-md-6 text-center">
  <h3>${i+1}. ${trackName}</h3>
  <h4>${album}</h4>
  <img src="${albumImgUrl}" alt=""${album}" class="img-responsive"/>
  <audio controls>
    <source src="${audioUrl}" type="audio/mpeg" class="img-responsive">
  Your browser does not support the audio element.
  </audio>
  <h5> Popularity: ${popularity}</h5>
  </div>
  `;
});

// console.log(tracksDiv)

        let modal = ` <div id="tracksModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel">
        <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
        <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="gridSystemModalLabel">${artist} Sample Tracks</h4>
        </div>
        <div class="modal-body">
        <div class="row">
        ${tracksDiv}
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

        </div>
        </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->`;
//puts JS modal on the html
        $('#modal').html(modal);
        //display our modal
        $('#tracksModal').modal();


      });

    });

  }
