# grafana/k6

```bash

docker run --rm -i -v ./results:/scripts -v ./results:/results --network maple-network  grafana/k6:0.58.0 run /scripts/test.js   --out json=/results/results.json
```

## Resources

- [k6 docs](https://grafana.com/docs/k6/latest/)
