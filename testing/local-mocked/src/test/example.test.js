const {GenericContainer, Wait} = require("testcontainers");
const {
    SFNClient,
    CreateStateMachineCommand,
    StartExecutionCommand,
    GetExecutionHistoryCommand
} = require("@aws-sdk/client-sfn");
const fs = require("fs/promises");
const {resolve} = require("path");
const waitForExpect = require("wait-for-expect");

describe('GrayscalerStepFunction', () => {
    let sfnContainer;
    let sfDefinition;
    let sfnClient;

    beforeAll(async () => {
        sfnContainer = await new GenericContainer("amazon/aws-stepfunctions-local")
            .withWaitStrategy(Wait.forListeningPorts())
            .withExposedPorts({container: 8083, host: 8083})
            .withName("sf-local")
            .withBindMounts([{
                source: resolve("mock-config.json"),
                target: "/home/StepFunctionsLocal/MockConfigFile.json"
            }])
            .withEnvironment({"SFN_MOCK_CONFIG": "/home/StepFunctionsLocal/MockConfigFile.json"})
            .start();
        const sfDefinitionTemplate = await fs.readFile(resolve("../../aws/state-machine.asl.json"), "utf-8")
        sfDefinition = sfDefinitionTemplate
            .replaceAll("${AWS::Region}", "us-east-1")
            .replaceAll("${AWS::AccountId}", "123456789012");
        sfnClient = new SFNClient({
            endpoint: `http://localhost:8083`,
            region: 'us-east-1',
            credentials: {accessKeyId: 'mocked', secretAccessKey: 'mocked'}
        })
    }, 120000)

    afterAll(async () => {
        await sfnContainer.stop();
    })

    test('executes to success when nsfw check passes', async () => {
        await sfnClient.send(new CreateStateMachineCommand({
            definition: sfDefinition,
            name: "GrayscalerStepFunction",
            roleArn: "arn:aws:iam::123456789012:role/TestIAMRole"
        }))

        await sfnClient.send(new StartExecutionCommand({
            stateMachineArn: "arn:aws:states:us-east-1:123456789012:stateMachine:GrayscalerStepFunction#HappyPath",
            name: "GrayscalerHappyPath"
        }))

        await waitForExpect(async () => {
            const history = await sfnClient.send(new GetExecutionHistoryCommand({
                executionArn: "arn:aws:states:us-east-1:123456789012:execution:GrayscalerStepFunction:GrayscalerHappyPath",
            }))

            const success = history.events?.find(
                event => event.type === "ExecutionSucceeded"
            );

            expect(success).toBeDefined()

            const output = JSON.parse(success.executionSucceededEventDetails.output)

            expect(output["StatusCode"]).toBe(200)
        })
    });
});