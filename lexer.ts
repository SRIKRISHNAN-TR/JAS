// let x = 5
//[LetToken, Identifertoken, Equlastoken, Numbertoken]

export enum Tokentype{
    Number,
    Identifier,
    Equals,
    OpenParen, CloseParen,
    BinaryOperator,
    Let,
}
const KEYWORDS : Record<string,Tokentype> = {
"let" : Tokentype.Let,
}
export interface Token{
    value: string,
    type: Tokentype,
}

function isAlpha(src : string){
return src.toUpperCase() != src.toLowerCase();
}

function isint (src : string){
    const c = src.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0),'9'.charCodeAt(0)];
    return (c >= bounds[0] && c <= bounds[1]);
}

function isskippable(src : string){
    return src == ' ' || src == '\n' || src == '\t';
}

function token(value = "",type:Tokentype) : Token{
    return{value,type};
}
export function tokenize(sourceCode : string) : Token[]{

const tokens = new Array<Token>();
const src = sourceCode.split("");

//Build each token until eof
while(src.length > 0){
if(src[0] === '('){
    tokens.push(token(src.shift(),Tokentype.OpenParen));
}
else if(src[0] === ')'){
    tokens.push(token(src.shift(),Tokentype.CloseParen));
}
else if(src[0] === '+' || src[0] === '-' ||src[0] === '*' ||src[0] === '/'){
    tokens.push(token(src.shift(),Tokentype.BinaryOperator));
}

else if(src[0] === '='){
    tokens.push(token(src.shift(),Tokentype.Equals));
}   
  else{
    if(isint(src[0])){
        let num ="";
        while(src.length > 0 && isint(src[0])){
            num += src.shift();
        }
            tokens.push(token(num,Tokentype.Number));
    } else if(isAlpha(src[0])){
        let identifier = "";
        while(src.length > 0 && isAlpha(src[0])){
            identifier += src.shift();
        }
        // check for reversed keywords
        const reserved = KEYWORDS[identifier];
        if(reserved == undefined){
            tokens.push(token(identifier,Tokentype.Identifier));
        }
        else{
            tokens.push(token(identifier,reserved));
        }
    }
    else if(isskippable(src[0])){
        src.shift();
    }
    else{
        console.log("Unreconginzed character found in souce code: ",src[0]);
        Deno.exit();
    }
  }
}

return tokens;
}

const source = await Deno.readTextFile("./test.txt");
for(const token of tokenize(source)){
    console.log(token);
}