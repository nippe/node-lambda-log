"use strict";
const assert = require('assert');
const log = require('./');

// Silence logs for testing
log.config.silent = true;

describe('Module', function() {
    it('should return a new instance', function() {
        assert(log instanceof log.LambdaLog);
    });
});

describe('LambdaLog', function() {
    describe('Properties', function() {
        describe('config', function() {
            it('should have config', function() {
                assert(log.config);
                assert.equal(typeof log.config, 'object');
            });
            
            it('config should have meta', function() {
                assert(log.config.hasOwnProperty('meta'));
                assert.equal(typeof log.config.meta, 'object');
            });
            
            it('config should have tags', function() {
                assert(log.config.hasOwnProperty('tags'));
                assert(Array.isArray(log.config.tags));
            });
            
            it('config should have dev flag', function() {
                assert(log.config.hasOwnProperty('dev'));
                assert.equal(typeof log.config.dev, 'boolean');
            });
            
            it('config should have silent flag', function() {
                assert(log.config.hasOwnProperty('silent'));
                assert.equal(typeof log.config.silent, 'boolean');
            });
        });
        
        it('should have access to LambdaLog', function() {
            assert(log.LambdaLog);
        });
    });
    
    describe('Methods', function() {
        describe('log', function() {
            it('should have log method', function() {
                assert(typeof log.log, 'function');
            });
            
            it('should return compiled log data', function() {
                let logData = log.log('info', 'Test log');
                assert.equal(typeof logData, 'object');
                assert.equal(logData.msg, 'Test log');
            });
            
            it('should aceept and parse Error object', function() {
                let err = new Error('Test error'),
                    logData = log.log('error', err);
                    
                assert.equal(typeof logData, 'object');
                assert.equal(logData.msg, 'Test error');
                assert(logData.stack);
            });
            
            it('should have tags', function() {
                let logData = log.log('error', 'Test tags');
                assert(Array.isArray(logData._tags));
                assert(logData._tags.indexOf('log') !== -1);
                assert(logData._tags.indexOf('error') !== -1);
            });
            
            it('should contain custom meta', function() {
                let logData = log.log('error', 'Test meta', { hello: 'world', arr: [], num: 32 });
                assert.equal(logData.hello, 'world');
                assert(Array.isArray(logData.arr));
                assert.equal(logData.num, 32);
            });
            
            it('should contain global meta', function() {
                log.config.meta.isWorking = true;
                let logData = log.log('error', 'Test meta', { hello: 'world' });
                assert.equal(logData.hello, 'world');
                assert(logData.isWorking);
            });
            
            it('should contain global tags', function() {
                log.config.tags.push('custom-tag', 32);
                let logData = log.log('error', 'Test global tags');
                assert(logData._tags.indexOf('custom-tag') !== -1);
                assert(logData._tags.indexOf(32) !== -1);
            });
        });
        
        describe('info', function() {
            it('should have info method', function() {
                assert(typeof log.info, 'function');
            });
            
            it('should set the correct level', function() {
                let logData = log.info('Test log level');
                assert(logData._tags.indexOf('info') !== -1);
            });
        });
        
        describe('warn', function() {
            it('should have warn method', function() {
                assert(typeof log.warn, 'function');
            });
            
            it('should set the correct level', function() {
                let logData = log.warn('Test log level');
                assert(logData._tags.indexOf('warn') !== -1);
            });
        });
        
        describe('error', function() {
            it('should have error method', function() {
                assert(typeof log.error, 'function');
            });
            
            it('should set the correct level', function() {
                let logData = log.error('Test log level');
                assert(logData._tags.indexOf('error') !== -1);
            });
        });
        
    });
    
    describe('Events', function() {
        it('should have event emitter methods', function() {
            assert(typeof log.emit, 'function');
            assert(typeof log.on, 'function');
        });
        
        it('should emit event on log', function(done) {
            log.once('log', function() {
                assert.ok(true);
                done();
            });
            
            log.log('info', 'Test event');
        });
        
        it('should emit event on log and provide log data', function(done) {
            log.once('log', function(data) {
                assert(data);
                done();
            });
            
            log.log('info', 'Test event data');
        });
    });
    
    describe('Statics', function() {
        describe('isError', function() {
            it('should have static method', function() {
                assert.equal(typeof log.LambdaLog.isError, 'function');
            });
            
            it('should return true for Error and Error-like objects', function() {
                let err = new Error('Test Error'),
                    typeErr = new TypeError('Test Type Error'),
                    errLike = {
                        message: 'Error-like object',
                        stack: 'Some stack trace'
                    };
                    
                assert(log.LambdaLog.isError(err));
                assert(log.LambdaLog.isError(typeErr));
                assert(log.LambdaLog.isError(errLike));
            });
            
            it('should return false for everything else', function() {
                assert(!log.LambdaLog.isError(null));
                assert(!log.LambdaLog.isError());
                assert(!log.LambdaLog.isError({}));
                assert(!log.LambdaLog.isError([]));
                assert(!log.LambdaLog.isError('test'));
                assert(!log.LambdaLog.isError(32));
                assert(!log.LambdaLog.isError(true));
                assert(!log.LambdaLog.isError(false));
                assert(!log.LambdaLog.isError(log));
            });
        });
    });
});
