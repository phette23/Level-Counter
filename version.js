// file.js
// usage: node file.js [new version]
// if no [new version] is passed, prints package.json to stdout
// otherwise updates version string

var fs = require( 'fs' ),
    filepath = process.argv[ 2 ],
    // 3rd word passed on the command line, e.g. node file.js $NEWVER
    newVer = process.argv[ 3 ];

if ( !filepath ) {
    console.log( '!ERROR!: no file path provided.' );
    process.exit();
}

function simpleErr ( err ) {
    if ( err ) throw err;
}

function switchVer( err, data) {
    simpleErr( err );

    // if new version was passed, validate its value & update file
    if ( newVer ) {
        if ( newVer.match( /\d+\.\d+\.\d+/ ) ) {
            var newFile = JSON.parse( data );
            if ( !newFile.version ) {
                console.log( '¡ERROR!: no version property found in JSON.' );
                process.exit();
            }
            newFile.version = newVer;
            newFile = JSON.stringify( newFile, null, '\t' );
            fs.writeFile( filepath, newFile, simpleErr );
        } else {
            console.log( 'Invalid version argument. Must be of form 1.12.3' );
            process.exit();
        }
    }
}

fs.readFile( filepath, 'utf8', switchVer );
