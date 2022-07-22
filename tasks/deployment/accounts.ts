import { task } from 'hardhat/config'

import { cliOpts } from '../../cli/defaults'
import { updateItemValue, writeConfig } from '../../cli/config'

task('migrate:accounts', '[localhost] Creates protocol accounts and saves them in graph config')
  .addParam('graphConfig', cliOpts.graphConfig.description, cliOpts.graphConfig.default)
  .setAction(async (taskArgs, hre) => {
    if (hre.network.name !== 'localhost') {
      throw new Error('This task can only be run on localhost network')
    }

    const { graphConfig } = hre.graph({ graphConfig: taskArgs.graphConfig })

    console.log('> Generating addresses')

    const [
      deployer,
      arbitrator,
      governor,
      authority,
      availabilityOracle,
      pauseGuardian,
      allocationExchangeOwner,
    ] = await hre.ethers.getSigners()

    console.log(`- Deployer: ${deployer.address}`)
    console.log(`- Arbitrator: ${arbitrator.address}`)
    console.log(`- Governor: ${governor.address}`)
    console.log(`- Authority: ${authority.address}`)
    console.log(`- Availability Oracle: ${availabilityOracle.address}`)
    console.log(`- Pause Guardian: ${pauseGuardian.address}`)
    console.log(`- Allocation Exchange Owner: ${allocationExchangeOwner.address}`)

    updateItemValue(graphConfig, 'general/arbitrator', arbitrator.address)
    updateItemValue(graphConfig, 'general/governor', governor.address)
    updateItemValue(graphConfig, 'general/authority', authority.address)
    updateItemValue(graphConfig, 'general/availabilityOracle', availabilityOracle.address)
    updateItemValue(graphConfig, 'general/pauseGuardian', pauseGuardian.address)
    updateItemValue(graphConfig, 'general/allocationExchangeOwner', allocationExchangeOwner.address)

    writeConfig(taskArgs.graphConfig, graphConfig.toString())
  })