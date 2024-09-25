import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import axios from "axios";

const typeDefs = `#graphql
  type Player {
    id: ID!
    name: String!
    games: [Game]
  }
  type Game {
    id: ID!
    date: String!
    stats: String!
  }
  type Query {
    players: [Player]
    playerGames(playerId: ID!): [Game]
    gameDetails(gameId: ID!): Game
  }
`;

const resolvers = {
  Query: {
    players: async () => {
      // Example: Fetch players from Riot API
      const response = await axios.get("https://api.riotgames.com/"); // Insert Riot API link
      console.log("players", response.data);
      return response.data;
    },
    playerGames: async (_: any, { playerId }: { playerId: string }) => {
      // Example: Fetch player games
      const response = await axios.get(
        `https://api.riotgames.com/players/${playerId}/games`
      );
      console.log("playerGames", response.data);
      return response.data;
    },
    gameDetails: async (_: any, { gameId }: { gameId: string }) => {
      // Example: Fetch game details
      const response = await axios.get(
        `https://api.riotgames.com/games/${gameId}`
      );
      console.log("gameDetails", response.data);
      return response.data;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);