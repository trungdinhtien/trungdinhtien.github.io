const socket = io('https://stream9000.herokuapp.com/');
$('#divchat').hide();


socket.on("danh_sach_online", arruserinfo => {
    $('#divchat').show();
    $('#divdangky').hide();

    arruserinfo.forEach(user => {
        const { ten, peerid } = user;
        $('#uluser').append('<li id="' + peerid + '">' + ten + '</li>');
    });

    socket.on("co_nguoi_dung_moi", user => {
        const { ten, peerid } = user;
        $('#uluser').append('<li id="' + peerid + '">' + ten + '</li>');
    });

    socket.on('userngatketnoi', peerid => {
        $('#' + peerid).remove();
    });
});

socket.on("dang_ky_that_bai", () => alert('Vui lòng chọn username khác'));

function openstream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function play(idvideotag, stream) {
    const video = document.getElementById(idvideotag);
    video.srcObject = stream;
    video.play();
}

//openstream().then(stream => play('localStream', stream));

var peer = new Peer({
    key: 'peerjs',
    host: '9000-dad872a0-16d9-42db-bcfb-309e15a0d6e1.ws-us02.gitpod.io',
    secure: true,
    port: 443
});

peer.on('open', id => {
    $('#mypeer').append(id);

    $('#btsignup').click(() => {
        const username = $('#txtusername').val();
        socket.emit('nguoi_dung_dang_ky', { ten: username, peerid: id } );
    });
});

//caller
$('#btcall').click(() => {
    const id = $('#remoteid').val();
    openstream().then(stream => {
        play('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remotestream => play('remoteStream', remotestream));
    });
});

peer.on('call', call => {
    openstream().then(stream => {
        call.answer(stream);
        play('localStream', stream);
        call.on('stream', remotestream => play('remoteStream', remotestream));
    });
});

$('#uluser').on('click', 'li', function () {
    const id= $(this).attr('id');

    openstream().then(stream => {
        play('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remotestream => play('remoteStream', remotestream));
    });
});