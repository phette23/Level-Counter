// version.js
// usage: node version.js $filename $newVersionNumber
// sets the "version" property found in $filename to $newVersionNumber
// only works on JSON files

var fs = require( 'fs' ),
    filepath = process.argv[ 2 ],
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
            console.log( '!ERROR!: invalid version. Must be of form 1.12.3' );
            process.exit();
        }
    }
}

fs.readFile( filepath, 'utf8', switchVer );
