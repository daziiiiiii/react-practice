import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
interface cacheRequest {
  [key: string]: object;
}

// 缓存请求
let cache = {} as cacheRequest;
function request(url: string) {
  if (cache[url]) {
    return Promise.resolve({ data: cache[url] });
  }

  return axios({ url }).then((e) => {
    cache[url] = e.data;
    return e;
  });
}

function useFetch(url: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!url) return;

    setLoading(true);

    request(url)
      .then((e) => {
        setData(e.data);
        if (e.data.msg) {
          setMsg(e.data.msg);
        }
      })
      .catch((err) => {
        setMsg(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  return {
    msg,
    data,
    loading
  };
}

function useDebounce(fn: Function) {
  let timer: any = useRef(0);

  return (e: any) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(e), 700);
  }
}

function App() {
  const [url, setUrl] = useState("");
  const { loading, data, msg } = useFetch(url);

  const onInput = useDebounce((e: any) => {
    if (!/[1-9]\d{4,14}/.test(e.target.value)) return;

    setUrl("https://api.uomg.com/api/qq.info?qq=" + e.target.value);
  });

  return (
    <div className="App">
      <h1>QQ号查询</h1>
      <div className="search">
        <span>QQ </span>
        <input type="text" onChange={onInput} />
        {msg ? <div className="tip">{msg}</div> : null}
      </div>

      {data || loading ? (
        <div className="wrap">
          <div className={`result ${loading ? "loading" : ""}`}>
            {data ? (
              <>
                <img src={data["qlogo"]} alt="" className="avatar" />
                <div className="info">
                  <p>{data["name"] || ""}</p>
                  <p>{data["qq"]}</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
