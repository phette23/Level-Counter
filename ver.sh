#! /bin/bash
#####################################
# Print or update the app's version #
#####################################
function usage() {
    echo -e "Usage: \t./ver.sh -p\t\t(print version number)"
    echo -e "\t./ver.sh -v\t\t(validate version across branches)"
    echo -e "\t./ver.sh -u \$NEW\t(update version to \$NEW)"
}

# no parameters
if [ -z "$1" ]
    then usage
    exit
fi

# check parameters
while getopts :pvu:h opt; do
    case $opt in
    p)
        egrep -o \"version\":[[:space:]]+\"[0-9]+\.[0-9]+\.[0-9]+\" package.json
        exit;;
    v)
        # validate versions
        # store current branch, return to it at end
        CURRENTBRANCH=$(git symbolic-ref HEAD 2>/dev/null | cut -d"/" -f 3)
        git stash -q
        # go to master, store Mozilla version
        git checkout -q master
        MOZMASTER=$(egrep -o \"version\":[[:space:]]+\"[0-9]+\.[0-9]+\.[0-9]+\" package.json)
        # go to chrome, get both versions
        git checkout -q chrome-app
        MOZCHROME=$(egrep -o \"version\":[[:space:]]+\"[0-9]+\.[0-9]+\.[0-9]+\" package.json)
        CHRCHROME=$(egrep -o \"version\":[[:space:]]+\"[0-9]+\.[0-9]+\.[0-9]+\" manifest.json)
        ERRORS=""
        if [[ $MOZMASTER != $MOZCHROME ]]
            then ERRORS+="¡ERROR!\nMozilla web app is $MOZMASTER on master & $MOZCHROME on chrome-app branch\n"
        fi
        if [[ $MOZMASTER != $CHRCHROME ]]
            then ERRORS+="¡ERROR!\nMozilla web app is $MOZMASTER on master & Chrome app manifest.json is $CHRCHROME\n"
        fi
        if [[ $MOZCHROME != $CHRCHROME ]]
            then ERRORS+="¡ERROR!\nMozilla web app is $MOZCHROME on chrome-app branch & Chrome app manifest.json is $CHRCHROME\n"
        fi
        if [[ $ERRORS == "" ]]
            then echo "Versions are valid across the master & chrome-app branches."
        else
            echo -en $ERRORS
        fi
        # return to current branch
        git checkout -q $CURRENTBRANCH
        git stash pop -q
        exit;;
    u)
        # update all versions to $OPTARG
        # store current branch, return to it at end
        CURRENTBRANCH=$(git symbolic-ref HEAD 2>/dev/null | cut -d"/" -f 3)
        git stash -q >/dev/null 2>&1
        # go to master, update Mozilla version
        git checkout -q master
        node version.js package.json $OPTARG
        git commit -am "vjs - version bump to $OPTARG"
        git tag v$OPTARG
        # go to chrome-app, update Mozilla & Chrome versions
        git checkout -q chrome-app
        node version.js package.json $OPTARG
        node version.js manifest.json $OPTARG
        git commit -am "vjs - version bump to $OPTARG"
        # return to current branch
        git checkout -q $CURRENTBRANCH
        git stash pop -q >/dev/null 2>&1
        exit;;
    h)
        usage
        exit;;
    \?)
        echo "Invalid option: -$OPTARG" >&2
        exit 1;;
    :)
        echo "Option -$OPTARG requires an argument." >&2
        exit 1;;
    esac
done
