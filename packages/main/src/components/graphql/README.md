NestJS 的 GraphQL 支持两种不同的方法：代码优先（code first）和模式优先（schema first），它们之间的主要区别如下：

1. 代码优先（Code First） :

- 在这种方法中，你使用 TypeScript 类和装饰器来定义 GraphQL 的模式（schema）。
- 这种方式适合那些喜欢完全使用 TypeScript 工作并避免在不同语言语法之间切换上下文的开发者。
- 你可以利用 TypeScript 的类型系统来增强你的 GraphQL 类型定义，并且 NestJS 会自动从 TypeScript 类生成 GraphQL 类型。
- 要使用代码优先方法，你需要在 GraphQLModule.forRoot() 方法中添加 autoSchemaFile 属性，这会生成一个 GraphQL 模式文件。

2. 模式优先（Schema First） :

- 在模式优先方法中，GraphQL 模式（schema）是使用 GraphQL SDL（Schema Definition Language）文件定义的。
- 这种方法允许你在不同的平台上以语言无关的方式共享模式文件。
- 你首先定义你的模式，然后 NestJS 会根据这些模式文件自动生成 TypeScript 类型定义，减少编写冗余样板代码的需要。
- 要使用模式优先方法，你需要在 GraphQLModule.forRoot() 方法中添加 typePaths 属性，这指示 NestJS 在哪里查找 GraphQL SDL 模式定义文件。

两种方法各有优势，选择哪一种取决于你的个人偏好和项目需求。代码优先方法可能更适合那些已经熟悉 TypeScript 和 NestJS 的开发者，而模式优先方法可能更适合那些需要在多个平台上共享和使用 GraphQL 模式的团队。

## Resources

- [nestjs graphql](https://docs.nestjs.com/graphql/quick-start)
- [graphql vs rest](https://www.apollographql.com/blog/graphql-vs-rest)
- [graphql](https://graphql.org/)
- [nestjs graphql example](https://github.com/nestjs/nest/tree/master/sample/23-graphql-code-first)
- [@apollo/client](https://www.npmjs.com/package/@apollo/client)
- [apollographql ApolloClient](https://www.apollographql.com/docs/react/api/core/ApolloClient/)
- [apollographql react](https://www.apollographql.com/docs/react/)
