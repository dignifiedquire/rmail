#[macro_use]
extern crate serde;

use std::collections::BTreeMap;
use uuid::prelude::*;
use web_view::*;

fn main() {
    let webview = web_view::builder()
        .title("rMail")
        .content(content())
        .size(800, 600)
        .resizable(true)
        .debug(true)
        .user_data(BTreeMap::default())
        .invoke_handler(|webview, arg| {
            cmd_handler(webview, arg);
            render(webview)
        })
        .build()
        .unwrap();

    let res = webview.run().unwrap();
    println!("final state: {:?}", res);
}

fn cmd_handler(webview: &mut WebView<BTreeMap<Uuid, Todo>>, arg: &str) {
    let todos = webview.user_data_mut();

    match serde_json::from_str(arg) {
        Ok(cmd) => match cmd {
            Cmd::Todo(cmd) => match cmd {
                TodoCmd::Init => {}
                TodoCmd::Add { title } => {
                    todos.insert(Uuid::new_v4(), Todo { title, done: false });
                }
                TodoCmd::ToggleAll => {
                    for todo in todos.values_mut() {
                        todo.done = !todo.done;
                    }
                }
                TodoCmd::Toggle { id } => {
                    if let Some(todo) = todos.get_mut(&id) {
                        todo.done = !todo.done;
                    }
                }
                TodoCmd::Destroy { id } => {
                    todos.remove(&id);
                }
                TodoCmd::Save { id, title } => {
                    if let Some(todo) = todos.get_mut(&id) {
                        todo.title = title;
                    }
                }
                TodoCmd::ClearCompleted => {
                    // unfortunately no retain on btreemap
                    *todos = todos
                        .into_iter()
                        .filter(|(_id, todo)| !todo.done)
                        .map(|(k, v)| (k.to_owned(), v.clone()))
                        .collect();
                }
            },
        },
        Err(err) => println!("unknown command: {} ({:?})", arg, err),
    }
}

fn render(webview: &mut WebView<BTreeMap<Uuid, Todo>>) -> WVResult {
    let render_todos = {
        let todos = webview.user_data();
        let list = todos
            .iter()
            .map(|(id, todo)| SendTodo {
                id: id.clone(),
                title: todo.title.clone(),
                done: todo.done,
            })
            .collect::<Vec<_>>();
        println!("{:#?}", list);
        format!(
            "rpc._emit('todo', 'update', {})",
            serde_json::to_string(&list).unwrap()
        )
    };
    webview.eval(&render_todos)
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct SendTodo {
    id: Uuid,
    title: String,
    done: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Todo {
    title: String,
    done: bool,
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "namespace", rename_all = "camelCase")]
pub enum Cmd {
    Todo(TodoCmd),
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "cmd", content = "payload", rename_all = "camelCase")]
pub enum TodoCmd {
    Init,
    Add { title: String },
    ToggleAll,
    Toggle { id: Uuid },
    Save { id: Uuid, title: String },
    Destroy { id: Uuid },
    ClearCompleted,
}

fn content() -> Content<&'static str> {
    // TODO: include non server version for production
    Content::Url("http://localhost:3000")
}
