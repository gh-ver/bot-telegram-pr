lustss = {
  'field-tested': 'ft',
  "minimal wear": 'mw',
  'well-worn': 'ww',
  'battle-scarred': 'bs',
  "factory new": 'fn'
};
const datas = [];
function get(_0xb8ab80) {
  document.getElementById('confurm').style.animation = "fadeIn 0.2s forwards";
  setTimeout(() => {
    document.getElementById('confurm').style.display = "flex";
  }, 0x64);
  const _0x207515 = datas.find(_0x5dbbf0 => _0x5dbbf0.qu === _0xb8ab80);
  document.getElementById("texts").innerHTML = "Нажмите кнопку подтвердить чтобы купить скин <br>" + _0x207515.hashs;
  document.getElementById('button').onclick = function () {
    getss(_0xb8ab80);
  };
  document.getElementById("png").src = "https://cdn2.csgo.com/item/image/width=500/" + encodeURIComponent(_0x207515.hashs) + ".png";
  document.getElementById("png").classList.add('skuns');
}
function getss(_0x33a321) {
  const _0x2f9014 = window.Telegram.WebApp;
  const _0x4ecce5 = datas.find(_0x498f90 => _0x498f90.qu === _0x33a321);
  _0x2f9014.sendData("skuns_" + JSON.stringify(_0x4ecce5));
}
const urlParams = new URLSearchParams(window.location.search);
function skuns() {
  const _0xe07bef = parseFloat(urlParams.get("bal"));
  fetch('https://dazzling-elf-4ecfc0.netlify.app/netlify/functions/proxy.js?url=' + encodeURIComponent("https://market.csgo.com/api/v2/prices/RUB.json")).then(_0x206402 => _0x206402.json()).then(_0x3a85f3 => {
    const _0x409966 = _0x3a85f3.items;
    let _0x243f09 = 0x0;
    background = document.getElementById("skunss");
    _0x409966.forEach((_0x35f8c2, _0x36c1a0) => {
      const _0x567fe3 = parseFloat(_0x35f8c2.price);
      if (_0x567fe3 > _0xe07bef / 0x64 * 0x46 && _0xe07bef / 0x64 * 0x5a > _0x567fe3) {
        const _0x132ad5 = _0x35f8c2.market_hash_name;
        datas.push({
          'price': _0x567fe3,
          'hashs': _0x132ad5,
          'qu': _0x243f09
        });
        let _0x4140a0 = document.createElement("div");
        _0x4140a0.classList.add("container-skunss", "games_indexs-items");
        let _0x7b97d2 = document.createElement("img");
        _0x7b97d2.src = 'https://cdn2.csgo.com/item/image/width=500/' + encodeURIComponent(_0x132ad5) + ".png";
        _0x7b97d2.classList.add("skuns");
        qualuty = document.createElement('div');
        qualuty.classList.add("qualuty");
        if (shortenQualuty(_0x132ad5)) {
          qualuty.innerText = shortenQualuty(_0x132ad5);
          _0x4140a0.appendChild(qualuty);
        }
        _0x4140a0.onclick = (_0x35116f => () => get(_0x35116f))(_0x243f09);
        _0x4140a0.append(_0x7b97d2);
        background.append(_0x4140a0);
        _0x243f09++;
      }
    });
  })["catch"](_0x5a2ab3 => {
    console.error("Ошибка при запросе данных:", _0x5a2ab3);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  skuns();
  window.onload = () => {
    const _0x3f9ff1 = document.getElementById('loading-screen');
    _0x3f9ff1.style.animation = "fadeIn 1s forwards reverse";
    setTimeout(() => _0x3f9ff1.style.display = "none", 0x3e8);
    document.getElementById("confurm").addEventListener("click", _0x133270 => {
      if (_0x133270.target.id === 'confurm') {
        document.getElementById("confurm").style.animation = "fadeOut 0.2s forwards";
        setTimeout(() => {
          document.getElementById("confurm").style.display = "none";
        }, 0x64);
      }
    });
  };
});
function shortenQualuty(_0x1bb5a8) {
  for (let _0xc596bd in lustss) {
    let _0xf6501d = new RegExp(_0xc596bd, 'i');
    if (_0xf6501d.test(_0x1bb5a8)) {
      return lustss[_0xc596bd];
    }
  }
  return false;
}
