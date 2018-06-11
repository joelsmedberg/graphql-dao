export interface IQlInput {
  query: string;
  variables: { [key: string]: any };
}

export class GraphDao {
  private static readonly DOMAIN = "https://backend-dev.mittskolval.se/graphql";
  public async post(body: IQlInput): Promise<any> {
      const resp = await fetch(GraphDao.DOMAIN, {
          body: JSON.stringify(body),
          credentials: "include",
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
          },
          method: "POST"
      });
      const text = await resp.text(); // Parse it as text
      if (text) {
          let data = JSON.parse(text).data;
          for(const key in data){
              return data[key];
          }
      }
      return undefined;
  }
}
