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
   bot.chat("Hello World!");
   return 0;
}
`.trim();

export const demoSession: SessionDTO = {
    id: "demo",
    modules: {
        bot: {
            name: "bot",
            functions: [
                { module: "bot", name: "chat", return_type: "int", parameter_types: [ "string" ], completion: "chat($1)$0" },
                { module: "bot", name: "deposit_item", return_type: "int", parameter_types: [ "string" ], completion: "deposit_item($1)$0" },
                { module: "bot", name: "get_block", return_type: "string", parameter_types: [ "string" ], completion: "get_block($1)$0" },
                { module: "bot", name: "get_direction", return_type: "string", parameter_types: [], completion: "get_direction()$0" },
                { module: "bot", name: "get_item", return_type: "string", parameter_types: [], completion: "get_item()$0" },
                { module: "bot", name: "get_selected_slot", return_type: "number", parameter_types: [], completion: "get_selected_slot()$0" },
                { module: "bot", name: "move", return_type: "int", parameter_types: [ "string" ], completion: "move($1)$0" },
                { module: "bot", name: "print", return_type: "int", parameter_types: [ "string" ], completion: "print($1)$0" },
                { module: "bot", name: "rotate_left", return_type: "int", parameter_types: [], completion: "rotate_left()$0" },
                { module: "bot", name: "rotate_right", return_type: "int", parameter_types: [], completion: "rotate_right()$0" },
                { module: "bot", name: "select_slot", return_type: "int", parameter_types: [ "int" ], completion: "select_slot($1)$0" },
                { module: "bot", name: "set_status", return_type: "int", parameter_types: [ "string", "int" ], completion: "set_status($1, $2)$0" },
            ]
        },
        math: {
            name: "math",
            functions: [
                { module: "math", name: "ceil", return_type: "float", parameter_types: [ "float" ], completion: "ceil($1)$0" },
                { module: "math", name: "cos", return_type: "float", parameter_types: [ "float" ], completion: "cos($1)$0" },
                { module: "math", name: "floor", return_type: "float", parameter_types: [ "float" ], completion: "floor($1)$0" },
                { module: "math", name: "round", return_type: "float", parameter_types: [ "float" ], completion: "round($1)$0" },
                { module: "math", name: "sin", return_type: "float", parameter_types: [ "float" ], completion: "sin($1)$0" },
                { module: "math", name: "sqrt", return_type: "float", parameter_types: [ "float" ], completion: "sqrt($1)$0" },
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