const emailRegex = /^\S+@\S+\.\S{2,3}$/; // TODO put this into utils

export default function (str) {
    return emailRegex.test(str);
}
