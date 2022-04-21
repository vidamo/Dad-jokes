import React, { Component } from 'react';
import Todo from './Todo';
import NewTodoForm from './NewTodoForm';
import { v4 as uuidv4 } from 'uuid';

class TodoList extends Component {
    state = { todos: [] };
    create = (NewTodo) => {
        this.setState({
            todos: [...this.state.todos, NewTodo]

        })
    }
    // remove = () => {
    //     const before = [...this.state.todos];
    //     before.splice(idx, 1);
    //     return before;
    // }
    update = (id, newEditItm, e) => {
        e.preventDefault();
        let before = [...this.state.todos];
        let objIndex = before.findIndex(item => item.id == id);
        before[objIndex].task = newEditItm;
        this.setState({ todos: before })

    }
    remove = (id) => {
        this.setState({ todos: this.state.todos.filter(t => t.id !== id) })
    }
    // componentDidUpdate(prevProps,prevState){
    //     console.log(prevState.todos);
    //     console.log(this.state.todos);

    // }

    componentWillUnmount() {
        console.log("willmount");
    }
    render() {
        const todos = this.state.todos.map(todo => {
            return <Todo update={this.update} removeTodo={this.remove} id={todo.id} key={todo.id} task={todo.task} />
        });

        return (
            <div>
                <h1>Todo List!</h1>
                <ul>
                    {todos}
                </ul>
                <NewTodoForm createTodo={this.create} />
            </div>
        )
    }

}

export default TodoList;