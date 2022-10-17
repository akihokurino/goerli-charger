vendor:
	npm install

run-local:
	LOCAL=true SSM_PARAMETER=/goerli-charger/server/dotenv AWS_REGION=ap-northeast-1 node_modules/.bin/ts-node src/local.ts

.PHONY: build
build:
	node_modules/.bin/webpack

# https://aws.amazon.com/jp/blogs/compute/using-container-image-support-for-aws-lambda-with-aws-sam/
deploy: build
	sam build
	sam deploy \
		--image-repository 326914400610.dkr.ecr.ap-northeast-1.amazonaws.com/goerli-charger \
		--no-fail-on-empty-changeset \
		--profile me

charge:
	aws lambda invoke \
		--function-name goerli-charger-BatchFunction-x1KrphA6BfR7 \
		--payload "{}" \
		--cli-binary-format raw-in-base64-out \
		--profile me \
		/dev/null