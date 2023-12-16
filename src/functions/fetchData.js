import axios from 'axios';

const mediaList = [];

const fetchData = async (username, page) => {
    const axiosInstance = axios.create({
        baseURL: 'https://api.example.com',
        timeout: 5000,
        retry: 3,
        retryDelay: 1000,
    });

    axiosInstance.interceptors.response.use(null, (error) => {
        const { config, response } = error;
      
        if (response && response.status === 429 && config.retry) {
          config.retryCount = config.retryCount || 0;
          config.retryCount += 1;
      
          if (config.retryCount <= config.retry) {
            const delay = new Promise((resolve) => {
              setTimeout(() => {
                resolve();
              }, config.retryDelay || 1000);
            });
      
            return delay.then(() => axiosInstance(config));
          }
        }
      
        return Promise.reject(error);
      });

    
	const query = `
    query ($userId: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          mediaList(userName: $userId, type: ANIME) {
            id
            media {
              title {
                romaji
                english
              }
              coverImage {
                large
              }
            }
          }
        }
      }
      
	`;

    const body = JSON.stringify({
        query: query,
        variables: {
            userId: username,
            page: page
        }
    })

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    const responseData = await axios.post('https://graphql.anilist.co', body, { headers })
    
    
    if(responseData.status === 200) {
        Array.prototype.push.apply(mediaList, responseData.data.data.Page.mediaList)
        if(responseData.data.data.Page.pageInfo.hasNextPage) {
            await fetchData(username, page + 1)
        }
    }

    for (let i = 0; i < mediaList.length; i++) {
      mediaList[i].rowId = 5;
    }
    return mediaList;
}

export default fetchData;