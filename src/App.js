import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class Todo extends Component {
  constructor() {
    super();
    this.toggleDone = this.toggleDone.bind(this);
  }

  toggleDone() {
    const todo = Object.assign({}, this.props.todo);
    todo.done = !this.props.todo.done;
    this.props.updateTodo(todo);
  }

  render() {
    return (
      <li>
        <input type="checkbox"
          className="toggle"
          checked={ this.props.todo.done }
          onChange={ this.toggleDone }
          />
        <label
          className={ this.props.todo.done ? "done" : "active" }>
          { this.props.todo.title }
        </label>
        <button className="remove"
          onClick={ () => {
            this.props.remove(this.props.todo.id); }
          }>✗</button>
      </li>
    );
  }
}

class TodoList extends Component {
  renderTodo(todo, index) {
    return (<Todo
      key={ index }
      todo={ todo }
      updateTodo={ this.props.updateTodo }
      remove={ this.props.remove } />);
  }

  render() {
    const todoes = this.props.todoes.map((todo, index) => {
      return this.renderTodo(todo, index);
    });

    return (
      <ul>
        { todoes }
      </ul>
    );
  }
}

class TodoForm extends Component {
  constructor() {
    super();
    this.addTodo = this.addTodo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault(); //ページのreloadを防ぐ
    this.addTodo();
  }

  addTodo() {
    const title = this.refs.title.value.replace(/^\s+|\s+$/g, "");
    // clear form
    this.refs.title.value = "";

    if (title !== "") {
      // create todo
      this.props.addTodo(title);
    }
  }

  render() {
    return (
      <form onSubmit={ this.handleSubmit }>
        <input type="text" ref="title"
          placeholder="タスクを入力" />
        <button type="button"
          onClick={ this.addTodo }>
          Add
        </button>
      </form>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      todoes: []
    };

    this.addTodo = this.addTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.remove = this.remove.bind(this);
  }

  async getTodoes() {
    const res = await fetch("http://localhost:8080/todos");
    const list = await res.json();
    if (list) {
      this.setState({ todoes: list });
    }
  }

  async addTodo(title) {
    console.log("add todo.");
    const params = {
      title,
      done: false
    };
    const res = await fetch("http://localhost:8080/todo",
      {
        body: JSON.stringify(params),
        cache: "no-cache",
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        mode: "cors"
      });
    console.log(res);

    // 再描画
    await this.getTodoes();
  }

  async updateTodo(todo) {
    console.log("update todo.");
    
    const res = await fetch("http://localhost:8080/todo",
      {
        body: JSON.stringify(todo),
        cache: "no-cache",
        headers: {
          "content-type": "application/json"
        },
        method: "PUT",
        mode: "cors"
      });
    console.log(res);

    // 再描画
    await this.getTodoes();
  }

  async remove(id) {
    console.log("remove todo.");
    
    const res = await fetch(`http://localhost:8080/todo/${id}`,
      {
        cache: "no-cache",
        headers: {
          "content-type": "application/json"
        },
        method: "DELETE",
        mode: "cors"
      });
    console.log(res);

    // 再描画
    await this.getTodoes();
  }

  componentDidMount() {
    this.getTodoes();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="todo">
          <TodoForm addTodo={ this.addTodo } />
          <TodoList todoes={ this.state.todoes }
            updateTodo={ this.updateTodo }
            remove={ this.remove }
            />
        </div>
      </div>
    );
  }
}

export default App;
