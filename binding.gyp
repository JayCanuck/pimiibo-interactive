{
    "targets": [{
        "target_name": "pimiibo_emitter",
        "sources": [
            "pimiibo-node/binding.cpp",
            "pimiibo-node/amiibo.cpp",
            "pimiibo-node/amiitool.cpp",
            "pimiibo-node/nfchandler.cpp",
            "pimiibo-node/pimiibo-emitter.cpp"
        ],
        'cflags!': [ '-fno-exceptions' ],
        'cflags_cc!': [ '-fno-exceptions' ],
        'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")"],
        'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
        'link_settings': {
            'libraries': ['-lnfc']
        }
    }]
}
