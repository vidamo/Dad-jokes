import React, { Component } from "react";
import Joke from './Joke';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import "./JokeList.css";


class JokeList extends Component {
    static defaultProps = {
        numJokesTOGet: 10
    };
    state = {
        jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
        loading: false
    };
    seenJokes = new Set(this.state.jokes.map(j => j.text));

    componentDidMount() {
        if (this.state.jokes.length === 0) this.getJokes();


    }
    getJokes = async () => {
        try {
            let jokes = [];
            while (jokes.length < this.props.numJokesTOGet) {
                let res = await axios.get("https://icanhazdadjoke.com/", { headers: { Accept: "application/json" } });
                if (!this.seenJokes.has(res.data.text)) {
                    jokes.push({ id: uuidv4(), text: res.data.joke, votes: 0 });
                } else {
                    console.log("Duplicate")
                }


            }
            this.setState(st => ({
                jokes: [...st.jokes, ...jokes],
                loading: false
            }));
            window.localStorage.setItem("jokes", JSON.stringify(jokes));
        } catch (e) {
            console.log(e)
        }


    }
    handleVote = (id, delta) => {
        this.setState(st => (
            {
                jokes: st.jokes.map(j =>
                    j.id === id ? { ...j, votes: j.votes + delta } : j

                )

            }),
            () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        );
    }
    handleCLick = () => {
        this.setState({ loading: true }, this.getJokes)

    }
    render() {
        if (this.state.loading) {
            return (
                <div className="spinner">
                    <i className="far fa-8x fa-laugh fa-spin"></i>
                    <h1>Loading...</h1>
                </div>
            )
        }
        let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes);

        return (

            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>
                            Dad
                        </span>
                        Jokes
                    </h1>
                    <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt="" />
                    <button className="JokeLit-getmore" onClick={this.handleCLick}>New Jokes</button>
                </div>

                <div className="JokeList-jokes">
                    {jokes.map(j => (
                        <Joke
                            key={j.id}
                            votes={j.votes}
                            text={j.text}
                            upvote={() => this.handleVote(j.id, 1)}
                            downvote={() => this.handleVote(j.id, -1)}

                        />

                    ))}

                </div>

            </div>

        )
    }
}

export default JokeList;