// 地図を作成する
var mymap = L.map('map');

// タイルレイヤーを作成し、地図にセットする
/*
L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank">©OSM ©HOT</a>',
}).addTo(mymap);
*/
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
}).addTo(mymap);


// 地図の中心座標とズームレベルを設定する
mymap.setView([35.6663051, 139.764409], 18);

// オリジナルアイコンを作成する
var markerIcon = L.icon({
    iconUrl: 'http://www.nowhere.co.jp/blog/wp-content/uploads/2018/07/marker.png', // アイコン画像のURL
    iconSize: [32, 32], // アイコンの大きさ
    iconAnchor: [16, 32], // 画像内でマーカーの位置を指し示す点の位置
    popupAnchor: [0, -32]  // ポップアップが出現する位置（iconAnchorからの相対位置）
});


// ①マーカーを作成する
//var marker = L.marker([35.6663051, 139.764409]).addTo(mymap); // デフォルトマーカーの場合
var marker = L.marker([35.6663051, 139.764409], { icon: markerIcon }).addTo(mymap);

// クリックした際にポップアップメッセージを表示する
//marker.bindPopup("WAKE");
// クリックした際にウィンドウを表示する場合
marker.on('click', function () {
    var win = L.control.window(mymap, { title: 'Hello world!', maxWidth: 400, modal: true })
        .content('<p style="color:red;">Lorem ipsum dolor sit amet,</p> consectetur adipiscing elit. Mauris ac sollicitudin eros, ut imperdiet felis. Pellentesque pretium mi ante, et faucibus ipsum rutrum sed. Proin accumsan luctus consectetur. <a href="https://github.com/mapshakers/leaflet-control-window">使い方</a>.')
        .prompt({ callback: function () { alert('This is called after OK click!') } })
        .show()
});


// ②マーカーをJSONで設定する場合
var geojsonFeature = [{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [139.7646, 35.66633]     // 経度,緯度の順になるので注意！
    },
    "properties": {
        "popupContent": "JSONで設定した場合"
    }
}];
// GeoJSON形式のマーカーをマップに追加する
L.geoJson(geojsonFeature,
    {
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.popupContent) {
                layer.bindPopup(feature.properties.popupContent);
            }
        }
    }).addTo(mymap);



// ③マーカーを複数個、配列で制御したいとき
var geojsonarray = [];                                // マーカー情報を格納する配列
var popupContents = ["東京", "大阪", "札幌", "那覇"];      // ポップアップで表示する内容
var lat = [35.69, 34.69, 43.06, 26.2125];               // 緯度
var lon = [139.69, 135.5, 141.35, 127.6811];            // 経度

for (var i = 0; i < 4; i++) {
    geojsonarray.push({     // 1つのマーカーの情報を格納する
        "type": "Feature",
        "properties": {
            "popupContent": popupContents[i]
        },
        "geometry": {
            "type": "Point",
            "coordinates": [lon[i], lat[i]]
        }
    });
}

// クリックしたらポップアップが出るように設定する
L.geoJson(geojsonarray,
    {
        // タッチイベント設定
        onEachFeature: function (feature, layer) {
            /*if (feature.properties && feature.properties.popupContent) {
              layer.bindPopup(feature.properties.popupContent);
            } */

            layer.on('click', function () {
                var win = L.control.window(mymap, { title: 'Hello world!', maxWidth: 400, modal: true })
                    .content(feature.properties.popupContent +
                        '<p style="color:red;">Lorem ipsum dolor sit amet,</p>')
                    .prompt({ callback: function () { alert('This is called after OK click!') } })
                    .show()
            });

        },

        // オリジナル画像を設定する
        pointToLayer: function (feature, latlng) {
            var myIcon = L.icon({
                iconUrl: 'https://wake-fashion.com/shop/wp-content/uploads/2019/06/WAKEfavi.png',  // 画像のURI
                iconSize: [25, 41],         // 画像のサイズ設定
                iconAnchor: [12, 40],       // 画像の位置設定
                popupAnchor: [0, -40]       // ポップアップの表示を開始する位置設定
            });
            return L.marker(latlng, { icon: myIcon });  // マーカーに画像情報を設定
        }
    }
).addTo(mymap);




