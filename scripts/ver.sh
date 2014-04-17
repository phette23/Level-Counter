#! /bin/bash
#####################################
# Print or update the app's version #
#####################################
function usage() {
    echo -e "Usage: \t./ver.sh -p\t\t(print version number)"
    echo -e "\t./ver.sh -v\t\t(validate version across branches)"
    echo -e "\t./ver.sh -u \$NEW\t(update version to \$NEW)"
}

function getver() {
    local ver=$(egrep -o \"version\":[[:space:]]+\"[0-9]+\.[0-9]+\.[0-9]+\" $1 | cut -c 12-)
    echo "$ver"
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
        getver package.json
        exit;;
    v)
        # validate versions
        # store current branch, return to it at end
        CURRENTBRANCH=$(git symbolic-ref HEAD 2>/dev/null | cut -d"/" -f 3)
        git stash -q

        # go to master, store Mozilla version
        git checkout -q master
        MASTERPJ=$(getver package.json)

        # go to chrome, get both versions
        git checkout -q chrome-app
        CHROMEMJ=$(getver app/manifest.json)
        CHROMEPJ=$(getver package.json)

        # yes, this is ugly as hell, but i couldn't get a lengthy set of comparisons to work in bash
        # transitive comparisons: don't need to exhaust every combination,
        # since if they're not all equal to $MOZMASTER they're not all equal
        if [[ $MASTERPJ != $CHROMEMJ ]]
            then err=1
        fi
        if [[ $MASTERPJ != $CHROMEPJ ]]
            then err=1
        fi
        if [[ $CHROMEMJ != $CHROMEPJ ]]
            then err=1
        fi

        if [[ $err == 1 ]]
            then echo -e "\033[01;31m¡ERROR!\033[0m Versions are inconsistent.

            on \033[01;33mmaster\033[0m:
            package.json is $MASTERPJ

            on \033[01;33mchrome-app\033[0m:
            app/manifest.json is $CHROMEMJ
            package.json is $CHROMEPJ"
        else
            echo "Versions are valid across both the master & chrome-app branches."
        fi

        # return to current branch
        git checkout -q $CURRENTBRANCH
        git stash pop -q >/dev/null 2>&1

        # Exit with error if there's an error
        [[ $err == 1 ]] && exit 1
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
        node version.js app/manifest.json $OPTARG
        node version.js package.json $OPTARG
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
