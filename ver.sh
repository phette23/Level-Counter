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
        MOZMASTER=$(getver app/package.json)
        YEOMASTER=$(getver package.json)

        # go to chrome, get both versions
        git checkout -q chrome-app
        MOZCHROME=$(getver app/package.json)
        CHRCHROME=$(getver app/manifest.json)
        YEOCHROME=$(getver package.json)

        # yes, this is ugly as hell, but i couldn't get a lengthy set of comparisons to work in bash
        # transitive comparisons: don't need to exhaust every combination,
        # since if they're not all equal to $MOZMASTER they're not all equal
        if [[ $MOZMASTER != $YEOMASTER ]]
            then err=1
        fi
        if [[ $MOZMASTER != $MOZCHROME ]]
            then err=1
        fi
        if [[ $MOZMASTER != $CHRCHROME ]]
            then err=1
        fi
        if [[ $MOZMASTER != $YEOCHROME ]]
            then err=1
        fi

        if [[ $err == 1 ]]
            then echo -e "\033[01;31m¡ERROR!\033[0m Versions are inconsistent.

            on \033[01;33mmaster\033[0m:
            app/package.json is $MOZMASTER
            package.json is $YEOMASTER

            on \033[01;33mchrome-app\033[0m:
            app/package.json is $MOZCHROME
            app/manifest.json is $CHRCHROME
            package.json is $YEOCHROME"
        else
            echo "Versions are valid across both the master & chrome-app branches."
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
        node version.js app/package.json $OPTARG
        node version.js package.json $OPTARG
        git commit -am "vjs - version bump to $OPTARG"
        git tag v$OPTARG
        # go to chrome-app, update Mozilla & Chrome versions
        git checkout -q chrome-app
        node version.js app/package.json $OPTARG
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
