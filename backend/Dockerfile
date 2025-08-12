FROM golang:1.24 AS builder

WORKDIR /app

ENV CGO_ENABLED=0

COPY go.* ./

RUN go mod download

COPY . .

RUN go build -o bookabike-backend ./cmd/main.go

FROM alpine:latest

ENV TZ=Europe/Helsinki

RUN apk --no-cache add ca-certificates tzdata \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

WORKDIR /opt/bookabike

COPY --from=builder /app/bookabike-backend .

EXPOSE 3000

CMD ["./bookabike-backend"]
