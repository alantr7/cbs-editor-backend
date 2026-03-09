import { DatabaseSessionFile } from "./utils/dbmodels";

interface SessionDTO {
    id: string,
    modules: Record<string, ModuleDTO>,
    files: DatabaseSessionFile[],
    last_modified: number,
    expires_at: number,
};

interface ModuleDTO {
    name: string,
    functions: FunctionDTO[],
}

interface FunctionDTO {
    module: string | null,
    name: string,
    return_type: string,
    parameter_types: string[],
    completion: string,
}

const demoCode = `
import bot;

int main() {
   
}
`.trim();

export const demoSession: SessionDTO = {
    id: "demo",
    modules: {
        bot: {
            name: "bot",
            functions: [
                { module: "bot", name: "move", return_type: "int", parameter_types: [ "string" ], completion: "move($1)$0" },
                { module: "bot", name: "print", return_type: "int", parameter_types: [ "string" ], completion: "print($1)$0" },
            ]
        },
        math: {
            name: "math",
            functions: [
                { module: "math", name: "cos", return_type: "float", parameter_types: [ "float" ], completion: "cos($1)$0" },
                { module: "math", name: "sin", return_type: "float", parameter_types: [ "float" ], completion: "sin($1)$0" },
                { module: "math", name: "sqrt", return_type: "float", parameter_types: [ "float" ], completion: "sqrt($1)$0" },
                { module: "math", name: "test", return_type: "float", parameter_types: [ "float" ], completion: "test($1)$0" },
            ]
        },
        lang: {
            name: "lang",
            functions: [
                { module: null, name: "strlen", return_type: "int", parameter_types: [ "string" ], completion: "strlen($1)$0" },
                { module: null, name: "is_int", return_type: "int", parameter_types: [ "string" ], completion: "is_int($1)$0" },
                { module: null, name: "to_int", return_type: "int", parameter_types: [ "string" ], completion: "to_int($1)$0" },
                { module: null, name: "is_float", return_type: "int", parameter_types: [ "string" ], completion: "is_float($1)$0" },
                { module: null, name: "to_float", return_type: "float", parameter_types: [ "string" ], completion: "to_float($1)$0" },
            ]
        }
    },
    files: [{ id: "main.cbs", name: "main.cbs", last_modified: Date.now(), content: demoCode }],
    last_modified: Date.now(),
    expires_at: Date.now() + 3 * 60 * 60 * 1000,
};