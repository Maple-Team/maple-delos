import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server'
import { Plugin } from '@nestjs/apollo'

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  async requestDidStart(): Promise<GraphQLRequestListener<AnyToFix>> {
    console.log('Request started')
    return {
      async willSendResponse() {
        console.log('Will send response')
      },
    }
  }
}
